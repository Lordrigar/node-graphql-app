#!/bin/bash

rsync -avz --delete --exclude-from=.rsyncignore -e ssh . do_nerdy:/var/www/zaorski.co.uk/html && \
        ssh do_nerdy 'cd /var/www/zaorski.co.uk/html && ./build.sh'
exit 1