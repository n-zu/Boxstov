#!/bin/bash

export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

session_name=boxstov_server
command="npm run start_cheap"
expected_message="Listening on port"

cd /home/boxstov/server
npm ci
npm run build

tmux has-session -t $session_name 2>/dev/null
if [ $? == 0 ]; then
    tmux kill-session -t $session_name
fi
tmux new -s $session_name -d $command

while true
do
    tmux has-session -t $session_name 2>/dev/null
    if [ $? != 0 ]; then
        echo "Error while deploying"
        exit 1
    fi
    if tmux capture-pane -J -pt $session_name | grep -q "$expected_message"; then
        break
    fi

    sleep 0.5
done

echo "Deployment complete."
