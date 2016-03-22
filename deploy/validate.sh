while [ true ]
do
  sleep 1
  HTTP_CODE=`curl -I -m 10 -o /dev/null -k -s -w %{http_code} https://localhost`
  echo "http code: ${HTTP_CODE}"
  if [ ${HTTP_CODE} -eq 200 ] || [ ${HTTP_CODE} -eq 302 ]
  then
    exit 0
  fi
done
