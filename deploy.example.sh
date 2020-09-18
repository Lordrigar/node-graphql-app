#!/bin/bash

rsync -avz --delete --exclude-from=.rsyncignore -e ssh . <ssh hostname>:<path> && \
        ssh <ssh hostname> 'cd <path> && ./build.sh'
exit 1