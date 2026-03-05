from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse, Http404

from . import models

# Create your views here.
def calculator(request):
    return render(request, 'index.html', {})

def plugins_index(request):
    all_plugins = models.Plugin.objects.all()
    plugins_list = []
    
    for plugin in all_plugins:
        plugins_list.append(plugin.slug)
        
    return JsonResponse(plugins_list, safe=False)

def plugin_fetch(request, slug):
    try:
        plugin = models.Plugin.objects.get(slug=slug)
    except Exception as e:
        return JsonResponse({'error': f"Could not find the plugin {slug}", 'status_code': 404}, status=404)
    
    return HttpResponse(plugin.content, content_type="application/javascript")