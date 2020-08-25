#!/bin/bash

printf "option_settings:\n  aws:elasticbeanstalk:application:environment:\n    $1: '$2'\n" \
    > py/.ebextensions/env_var_$1.config

