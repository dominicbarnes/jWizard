---
layout: default
title: Demonstrations
description: Here are the various demonstrations I've set up to show you the power and flexibility of jWizard.
keywords: [demonstrations]
---

## {{ page.title }}

I've included a number of demonstrations of the functionality and customizability of jWizard here. Feel free to [contact](/contact.html) me with further questions.

{% for demo in site.posts %}
* [{{ demo.title }}](/jWizard{{ demo.url }}){% endfor %}