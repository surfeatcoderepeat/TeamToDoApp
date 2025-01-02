from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, Project, ShareToken

class SharedTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShareToken
        fields = {'id', 'token', 'project', 'created_at', 'expires_at'}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = {'id', 'username', 'email'}

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'users']
        read_only_fields = ['users']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'project', 'title', 'description', 'completed', 'priority', 'user', 'cost', 'date', 'created_at', 'updated_at']