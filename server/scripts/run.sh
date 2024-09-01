#!/bin/bash

# cd server
# npm ci
# npm run build
tmux kill-session -t boxstov_server 2>/dev/null
tmux new -s boxstov_server -d 'npm run start_cheap'

while true; do

  # Capture the output of the tmux session
  result=$(tmux capture-pane -pt boxstov_server)

  # Check if tmux session output retrieval failed
  if [ $? -ne 0 ]; then
    echo "Server failed to start!"
    exit 1
  fi

  # Check if the output contains 'Error'
  echo "$result" | grep -q 'Error'
  if [ $? -eq 0 ]; then
    echo "Server failed to start!"
    exit 1
  fi

  # Check if the output contains the success message
  echo "$result" | grep -q 'action: server_up | result: success'
  if [ $? -eq 0 ]; then
    echo "Server started successfully!"
    break
  fi

  # Wait a bit before checking again
  sleep 1
done

echo "Deployment complete."