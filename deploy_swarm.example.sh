#!/bin/bash

rsync -avz --delete --exclude-from=.rsyncignore -e ssh . <ssh hostname>:<path> && \
        ssh <ssh hostname> 'cd <path> && ./build_swarm.sh'
exit 1