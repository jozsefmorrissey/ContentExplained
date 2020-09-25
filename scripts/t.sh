elem='list[0]'

if [[ "$elem" =~ ^[a-zA-Z0-9]*\[[0-9]*\]$ ]]
then
  end=${elem##*[}
  echo ${elem:0:${#elem} - ${#end} - 1}
fi
