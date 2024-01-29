from rest_framework import serializers
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'password', 'role', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'default': UserProfile.USER_ROLE}
        }

    def create(self, validated_data):
        user = UserProfile.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        # Handle updating of user, especially the password
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
