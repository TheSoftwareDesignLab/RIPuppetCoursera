#!/bin/bash

# Con este script cada rama que ya no exista en el repositiro remoto se elimina en el repositorio local.

git fetch --all -p; git branch -vv | grep ": gone]" | awk '{ print "git branch -D "$1 }' | sh