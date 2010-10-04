---
layout: default
title: Demonstrations
---

## {{ page.title }}

I've included a number of demonstrations of the functionality and customizability of jWizard here. Feel free to [contact](/contact.html) me with further questions.

{% for demo in site.posts reversed %}
* [{{ demo.title }}](/jWizard{{ demo.url }}){% endfor %}