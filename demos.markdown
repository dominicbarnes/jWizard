---
layout: default
title: Demonstrations
---

{% for demo in site.posts %}
  * [{{ demo.title }}](/jWizard{{ demo.url }})
{% endfor %}