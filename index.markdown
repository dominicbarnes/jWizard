---
layout: default
title: Home
description: jWizard is a jQuery UI Widget for generating a Wizard interface for your web pages and applications.
keywords: [home, demonstrations]
---

## jWizard jQuery UI Widget

Source code, examples and more available on [GitHub](http://github.com/dominicbarnes/jWizard).

### Demonstrations

{% for demo in site.posts reversed %}
 * [{{ demo.title }}](/jWizard{{ demo.url }}) - {{ demo.description }}
{% endfor %}