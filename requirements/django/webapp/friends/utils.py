from friends.models import FriendRequest
from django.contrib.auth.models import User

# change to exists()
def is_existing_request(sender, recipient):
    #request = None
    #try:
    #    request = FriendRequest.objects.get(sender=sender, recipient=recipient)
    #except FriendRequest.DoesNotExist:
    #    pass
    #if request:
    #    return sender

    #reverse_request = None
    #try:
    #    reverse_request = FriendRequest.objects.get(sender=recipient, recipient=sender)
    #except FriendRequest.DoesNotExist:
    #    pass
    #if reverse_request:
    #    return recipient

    if FriendRequest.objects.filter(sender=sender, recipient=recipient).exists():
        return sender

    if FriendRequest.objects.filter(sender=recipient, recipient=sender).exists():
        return recipient

    return None
