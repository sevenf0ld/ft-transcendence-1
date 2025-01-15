from django.shortcuts import render

# Create your views here.
# https://github.com/encode/django-rest-framework/blob/master/rest_framework/viewsets.py#L245
# https://github.com/encode/django-rest-framework/blob/master/rest_framework/generics.py#L188
# https://github.com/encode/django-rest-framework/blob/master/rest_framework/mixins.py#L12
from rest_framework import viewsets, generics, mixins, status
from .models import FriendRequest, FriendList
from .serializers import FriendRequestModelSerializer, FriendListDisplayModelSerializer, FriendListUpdateModelSerializer
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth.models import User
from .utils import is_existing_request
from http import HTTPMethod
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from dj_rest_auth.jwt_auth import JWTCookieAuthentication

#=================================#
#=========friend request==========#
#=================================#

#=================================#
#=============VIEWSET=============#
#=================================#
# consolidate the all the apiviews here
#class FriendRequestViewSet(viewsets.ModelViewSet):
#    queryset = FriendRequest.objects.filter(is_active=True)
#    serializer_class = FriendRequestModelSerializer
#
#    def get_queryset(self):
#        username = self.request.user
#        return FriendRequest.objects.filter(Q(recipient__username=username) | Q(sender__username=username), is_active=True)

# decouple cancel, decline and accept instead of using if-else branching
##class FriendRequestWriteOnlyViewSet(mixins.DestroyModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
#class FriendRequestWriteOnlyViewSet(mixins.DestroyModelMixin, viewsets.GenericViewSet):
#    queryset = FriendRequest.objects.filter(is_active=True)
#    serializer_class = FriendRequestModelSerializer
#
#    # url = reverse('friends:fw-cancel-request', kwargs={'pk': 2})
#    # /api/friends/friend-request-write/2/cancel_request/
#    @action(detail=True, methods=[HTTPMethod.DELETE])
#    def cancel_request(self, request, pk=None):
#        return Response({'detail': 'You are in cancel.'}, status=status.HTTP_200_OK)

#=================================#
#=============APIVIEW=============#
#=================================#
class FriendRequestCreateAPIView(generics.CreateAPIView):
    queryset = FriendRequest.objects.filter(is_active=True)
    serializer_class = FriendRequestModelSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # User objects
        sender = serializer.validated_data['sender']
        recipient = serializer.validated_data['recipient']
        sender_friendlist = FriendList.objects.get(user=sender)
        if sender_friendlist.is_friend(recipient):
             return Response({'detail': f'Friend request failed as you are already friends with {recipient}.'}, status=status.HTTP_400_BAD_REQUEST)
        if sender_friendlist.is_blocked(recipient):
             return Response({'detail': f'Friend request failed as you have blocked {recipient}.'}, status=status.HTTP_400_BAD_REQUEST)
        recipient_friendlist = FriendList.objects.get(user=recipient)
        if recipient_friendlist.is_blocked(sender):
             return Response({'detail': f'Friend request failed as you have been blocked by {sender}.'}, status=status.HTTP_400_BAD_REQUEST)

        existing = is_existing_request(sender, recipient)
        if existing is not None:
            # outgoing (sender)
            if existing.id == sender.id:
                return Response({'detail': f'You have previously sent a friend request to {recipient}.'}, status=status.HTTP_400_BAD_REQUEST)
            # incoming (recipient)
            elif existing.id == recipient.id:
                return Response({'detail': f'{recipient} has previously sent you a friend request.'}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# retrieve is relevant to a single instance
#class FriendRequestRetrieveAPIView(generics.RetrieveAPIView):
#    queryset = FriendRequest.objects.filter(is_active=True)
#    serializer_class = FriendRequestModelSerializer

# list's use case is to be reviewed
#class FriendRequestListAPIView(generics.ListAPIView):
#    serializer_class = FriendRequestModelSerializer
#    queryset = FriendRequest.objects.filter(is_active=True)
#
#    def get_queryset(self):
#        username = self.request.user
#        return FriendRequest.objects.filter(Q(recipient__username=username) | Q(sender__username=username), is_active=True)

class FriendRequestDestroyAPIView(generics.DestroyAPIView):
    queryset = FriendRequest.objects.filter(is_active=True)
    serializer_class = FriendRequestModelSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    # lookup_field is url related
    def get_object(self):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        sender = serializer.validated_data['sender']
        recipient = serializer.validated_data['recipient']
        handler = str(self.request.path).split('/')[-2]
        fr = None

        existing = is_existing_request(sender, recipient)
        if existing is None:
            return None

        # outgoing (sender)
        if existing.id == sender.id and handler == 'cancel':
            fr = FriendRequest.objects.get(sender=sender, recipient=recipient)
        # incoming (recipient)
        elif existing.id == recipient.id:
            if handler == 'decline' or handler == 'accept':
                fr = FriendRequest.objects.get(sender=recipient, recipient=sender)

        self.check_object_permissions(self.request, fr)

        return fr

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        handler = str(self.request.path).split('/')[-2]

        if instance is None:
            return Response({'detail': f'Failed to {handler} a non-existent request.'}, status=status.HTTP_400_BAD_REQUEST)
        if handler == 'cancel':
            instance.cancel()
            self.perform_destroy(instance)
            return Response({'detail': 'Friend request cancelled.'}, status=status.HTTP_204_NO_CONTENT)
        elif handler == 'decline':
            instance.decline()
            self.perform_destroy(instance)
            return Response({'detail': 'Friend request declined.'}, status=status.HTTP_204_NO_CONTENT)
        elif handler == 'accept':
            instance.accept()
            self.perform_destroy(instance)
            return Response({'detail': 'Friend request accepted. You are now friends.'}, status=status.HTTP_204_NO_CONTENT)

        return Response({'detail': f'Failed to {handler} friend request.'}, status=status.HTTP_400_BAD_REQUEST)

#=================================#
#==========friend list============#
#=================================#

#=================================#
#=============VIEWSET=============#
#=================================#
# retrieve + list
# retrieve is relevant to a single instance
# list's use case is to be reviewed
#class FriendListReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
#    serializer_class = FriendListModelSerializer
#    queryset = FriendList.objects.all()

#=================================#
#=============APIVIEW=============#
#=================================#
# retrieve is relevant to a single instance
class FriendListRetrieveAPIView(generics.RetrieveAPIView):
    queryset = FriendList.objects.all()
    serializer_class = FriendListDisplayModelSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def get_object(self):
        fl = FriendList.objects.get(user=self.request.user)

        self.check_object_permissions(self.request, fl)

        return fl

# list's use case is to be reviewed
#class FriendListListAPIView(generics.ListAPIView):
#    queryset = FriendList.objects.all()
#    serializer_class = FriendListDisplayModelSerializer

class FriendListUpdateAPIView(generics.UpdateAPIView):
    queryset = FriendList.objects.all()
    serializer_class = FriendListUpdateModelSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def get_object(self):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        # User objects
        # user is the initiator
        initiator = serializer.validated_data['user']
        target = serializer.validated_data['target']
        handler = str(self.request.path).split('/')[-2]

        fl_i = FriendList.objects.get(user=initiator)
        if handler == 'unfriend' or handler == 'block':
            if not fl_i.is_friend(target):
                return None
        elif handler == 'unblock':
            if not fl_i.is_blocked(target):
                return None

        self.check_object_permissions(self.request, fl_i)

        return fl_i

    def update(self, request, *args, **kwargs):
        #partial = kwargs.pop('partial', False)
        instance = self.get_object()
        handler = str(self.request.path).split('/')[-2]
        target_username = request.data['target']
        target = User.objects.get(username=target_username)
        #serializer = self.get_serializer(instance, data=request.data, partial=partial)
        #serializer.is_valid(raise_exception=True)

        if instance is None:
            return Response({'detail': f'Failed to {handler} a non-existent friendship.'}, status=status.HTTP_400_BAD_REQUEST)
        if handler == 'unfriend':
            instance.unfriend(target)
            #self.perform_update(serializer)
            return Response({'detail': 'Unfriended. You will no be able to chat with this individual.'}, status=status.HTTP_200_OK)
        elif handler == 'block':
            instance.block(target)
            #self.perform_update(serializer)
            return Response({'detail': 'Blocked. You may no longer be able to view this indivual\'s profile or chat with them.'}, status=status.HTTP_200_OK)
        elif handler == 'unblock':
            instance.unblock(target)
            #self.perform_update(serializer)
            return Response({'detail': 'Unblocked. They may view your profile or send you a friend request.'}, status=status.HTTP_200_OK)

        return Response({'detail': f'{target_username} was not {handler}ed.'}, status=status.HTTP_400_BAD_REQUEST)

        #return Response(serializer.data)
