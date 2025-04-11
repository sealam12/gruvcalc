from django.db import models

# Create your models here.
class Plugin(models.Model):
    name = models.CharField(max_length=1000)
    description = models.CharField(max_length=1000)
    
    content = models.TextField()