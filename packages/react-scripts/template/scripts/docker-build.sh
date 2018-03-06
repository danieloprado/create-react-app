set -e

echo 'Generating docker...'
if [ "$1" = '--production' ] || [ "$1" = '-p' ]; then
  echo 'BUILDING FOR PRODUCTION...'
  docker build -t your-account/your-repository:prod -f docker/prod/Dockerfile .
  docker push your-account/your-repository:prod
  exit
fi

echo 'BUILDING FOR HOMOLOG...'
docker build -t your-account/your-repository:hml -f docker/prod/Dockerfile .
docker push your-account/your-repository:hml