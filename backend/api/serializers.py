from rest_framework import serializers

from .models import Test, TestResult, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'account', 'password', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True},  # 在回應中隱藏密碼
            'user_id': {'read_only': True}    # UUID 自動生成，不需要手動設置
        }

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['test_id', 'title', 'user_id', 'questions', 'results', 'backgroundImage']
        extra_kwargs = {
            'test_id': {'read_only': True}    # UUID 自動生成，不需要手動設置
        }

class TestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = ['result_id', 'user_id', 'test_id', 'answers', 'result_index', 'date']
        extra_kwargs = {
            'result_id': {'read_only': True}, # UUID 自動生成，不需要手動設置
            'date': {'read_only': True}       # 自動生成的時間戳，不需要手動設置
        }
