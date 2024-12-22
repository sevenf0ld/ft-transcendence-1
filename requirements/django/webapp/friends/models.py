from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.utils import timezone

#class Friend(models.Model):
#    user = models.ForeignKey(
#        User,
#        on_delete=models.CASCADE,
#        related_name='person'
#    )
#
#    friend = models.ForeignKey(
#        User,
#        on_delete=models.CASCADE,
#        related_name='friends_with'
#    )
#
#    status = models.CharField(
#        max_length=50,
#        choices=[
#            ('accepted', 'Accepted'),
#            ('declined', 'Declined'),
#            ('blocked', 'Blocked'),
#            ('outgoing', 'Outgoing'),
#            ('incoming', 'Incoming')
#        ]
#    )
#
#    #=================================#
#    #=========class metadata==========#
#    #=================================#
#
#    class Meta:
#        ordering = ['friend__username']
#
#    #=================================#
#    #=====default model methods=======#
#    #=================================#
#
#    def __str__(self):
#        return f'{self.user.username} and {self.friend.username} has a friendship status of: {self.status}'

#=================================#
#=========friend request==========#
#=================================#

# outgoing, cancel, incoming, decline, accept
class FriendRequest(models.Model):
    # a user can potentially send any number of requests
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sender'
    )

    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recipient'
    )

    # becomes inactive upon acceptance, declination or cancellation
    is_active = models.BooleanField(
        blank=True,
        null=False,
        default=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    #class Meta:
    #    unique_together = ('sender', 'recipient')

    # incoming - recipient
    def accept(self):
        '''
        Adds sender and recipient to the respective friend list.
        Deactivates the request.
        '''
        recipient_friend_list = FriendList.objects.get(user=self.recipient)
        if recipient_friend_list:
            recipient_friend_list.add_acc(self.sender)
            sender_friend_list = FriendList.objects.get(user=self.sender)
            if sender_friend_list:
                sender_friend_list.add_acc(self.recipient)
                self.is_active = False
                self.save()

    # incoming - recipient
    def decline(self):
        '''
        Deactivates the incoming request.
        '''
        self.is_active = False
        self.save()

    # outgoing - sender
    def cancel(self):
        '''
        Deactivates the outgoing request.
        '''
        self.is_active = False
        self.save()

    def __str__(self):
        return f'Viewing {self.sender.username}\'s friend requests'

#=================================#
#==========friend list============#
#=================================#

# friends list and blocked list
class FriendList(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='user'
    )
    
    friends = models.ManyToManyField(
        User,
        blank=True,
        related_name='friends'
    )

    blocked = models.ManyToManyField(
        User,
        blank=True,
        related_name='blocked'
    )

    def add_acc(self, account):
        '''
        Adds account to user's friend list.
        '''
        if not account in self.friends.all():
            self.friends.add(account)

    def remove_acc(self, account):
        '''
        Removes account from user's friend list.
        '''
        if account in self.friends.all():
            self.friends.remove(account)

    def block_acc(self, account):
        '''
        Removes account from user's friend list and subsequently blocks account.
        '''
        if account in self.friends.all():
            self.friends.remove(account)
        self.blocked.add(account)

    def unblock_acc(self, account):
        '''
        Removes account from user's blocked list.
        '''
        if account in self.blocked.all():
            self.blocked.remove(account)

    def is_friend(self, account):
        '''
        Determines if user are friends with the account.
        '''
        return self.friends.filter(id=account.id).exists()

    def is_blocked(self, account):
        '''
        Determines if user blocked the account.
        '''
        return self.blocked.filter(id=account.id).exists()

    def unfriend(self, removee):
        '''
        Removes removee from user's friend list.
        Removes the user from removee's friend list.
        '''
        self.remove_acc(removee)

        removee_friend_list = FriendList.objects.get(user=removee)
        if removee_friend_list:
            removee_friend_list.remove_acc(self.user)

    def block(self, blockee):
        '''
        Removes blockee from user's friend list and subsequently blocks blockee.
        Removes the user from blockee's friend list.
        '''
        self.block_acc(blockee)

        blockee_friend_list = FriendList.objects.get(user=blockee)
        if blockee_friend_list:
            blockee_friend_list.remove_acc(self.user)

    def unblock(self, blockee):
        '''
        Removes blockee from user's block list.
        '''
        self.unblock_acc(blockee)

    def __str__(self):
        return f'Viewing {self.user.username}\'s friends'
