from django.db import models

# Create your models here.
class Plugin(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=1000)
    description = models.CharField(max_length=1000)
    
    content = models.TextField()

    def __str__(self):
        return self.name