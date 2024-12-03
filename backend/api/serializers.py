from rest_framework import serializers

from .models import Item, User


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'account', 'password']
        extra_kwargs = {
            'password': {'write_only': True}  # Hide password in responses
        }
