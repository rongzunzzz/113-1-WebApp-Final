import uuid

from django.db import models


class User(models.Model):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255, unique=True)
    account = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'User' 
        

class Test(models.Model):
    # test_id = models.CharField(max_length=100, unique=True) 
    test_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, default='未命名測驗') 
    user_id = models.CharField(max_length=100) 
    questions = models.JSONField(default=list) 
    results = models.JSONField(default=list) 
    backgroundImage = models.TextField(null=True, blank=True) 

    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'Test'


class TestResult(models.Model):
    # result_id = models.CharField(max_length=100, unique=True) 
    result_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=255)
    test_id = models.CharField(max_length=255)
    answers = models.JSONField() 
    result_index = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result for test {self.test_id} by user {self.user_id}"
    
    class Meta:
        db_table = 'TestResult'