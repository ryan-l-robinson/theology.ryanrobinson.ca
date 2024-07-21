---
title: "&#8220;Cannot Modify Header Information: Headers Already Sent&#8221;"
date: "2021-05-14T10:34:00-04:00"
author: "Ryan Robinson"
layout: post
permalink: /websites/cannot-modify-header-information-headers-already-sent/
image:
  src: /assets/img/logo/Visual-Studio-Code.png
  width: 300
  height: 300
  alt: "Visual Studio Code logo"
categories:
  - Websites
---

Recently I loaded up a client website to do some standard WordPress. The public site was fine, but when I tried to login to the admin, I got the dreaded White Screen of Death. For those unfamiliar, this is a blank white screen, with no error visible to help diagnose the problem.

I began doing some general research on the White Screen of Death and trying the different common solutions: disable plugins (by renaming the plugins folder via FTP), update themes, update WordPress core. Nothing worked.

Then I checked out the Apache error log and got a big hint:

> PHP Warning: Cannot modify header information – headers already sent by (output started at \[file structure\]/wp-config.php:174) in \[file structure\]/wp-login.php on line 530

So I did some more research on that error and found this: [How to fix PHP/WordPress Warning: Cannot Modify Header Information (templatetoaster.com)](https://blog.templatetoaster.com/cannot-modify-header-information/). The bottom line: look at the first file cited. That’s where the problem is.

In my case, the error was in my wp-config file. It was as simple as having extra whitespace at the end of the file. That’s enough to take down the entire admin section of the site. Ultimately it was an easy fix, but hard to find, so hopefully this helps you if you have a similar problem.
