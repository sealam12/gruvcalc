from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse

from . import models

# Create your views here.
def calculator(request):
    return render(request, 'index.html', {})

def plugins_index(request):
    all_plugins = models.Plugin.objects.all()
    plugins_list = []
    
    for plugin in all_plugins:
        plugins_list.append(plugin.name)
        
    return JsonResponse(plugins_list, safe=False)

def plugin_fetch(request, id):
    plugin = get_object_or_404(models.Plugin, pk=id)
    
    plugin = {
        "Name": plugin.name,
        "Description": plugin.description,
        "Content": plugin.content,
    }
        
    return JsonResponse(plugin)