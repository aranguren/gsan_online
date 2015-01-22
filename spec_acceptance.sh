#!/bin/bash
cd ../gsan_cadastro
PID_FILE="$(pwd)/tmp/pids/test.pid"
rake log:clear

RAILS_ENV=test ACCEPTANCE_TEST=1 rake db:seed
RAILS_ENV=test rails s -p 3002 -d -P $PID_FILE

cd ../gsan_online
rake log:clear

if [ "$1" = "" ]; then
  rspec spec_acceptance
else
  rspec $@
fi

if [ -e "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  kill -9 $PID && rm "$PID_FILE"
fi
