#!/usr/bin/env bash
set -euo pipefail

export DJANGO_SECRET_KEY='VeryStrongLocalDevSecretKey_ChangeMe_1234567890'

../back-end/.venv/bin/python ../back-end/manage.py migrate
../back-end/.venv/bin/python ../back-end/manage.py shell -c "exec(open('../back-end/scripts/seed_e2e.py').read())"
../back-end/.venv/bin/python ../back-end/manage.py runserver 127.0.0.1:8000
