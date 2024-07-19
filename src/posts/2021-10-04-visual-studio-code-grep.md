---
id: 1629
title: 'Visual Studio Code: Grep'
date: '2021-10-04T10:14:00-04:00'
author: 'Ryan Robinson'
layout: post
permalink: /websites/visual-studio-code-grep/
image:
  src: /assets/img/logo/Visual-Studio-Code.png
  width: 300
  height: 300
  alt: "Visual Studio Code logo"
categories:
    - Websites
tags:
    - 'Visual Studio Code'
---

This is a quick post about a feature I discovered by accident in Visual Studio Code that I really like:

I was working in [a Linux machine and ran a grep in the integrated terminal](/websites/visual-studio-code-remote-ssh-development/) to find a particular piece of code. The terminal gave me the results in the usual way, with the file names highlighted, the line in the code, and a bit of the code around what I searched for. Then I happened to scroll over the file name in the results and it showed me a tooltip offering that I could open the file by holding Ctrl and clicking on the path.

So I tried it, and it worked as advertised. This is one of those tiny things that will really add up. I use grep a lot. Most of the time when I do I want to open one or more of the files found. Without this little feature, that means copying the path to the file into a new command. That’s a small amount of time, but it does add up.