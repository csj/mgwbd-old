#!/bin/bash

if [ -z $VIRTUAL_ENV ]; then
  echo "Run \`source py/env/bin/activate\` first."
  exit
fi

FLASK_ENV=development FLASK_APP=py/wsgi python -m flask run

