BEGIN{
    while (( getline < "SubjLoadOrder")>0) order[$1,$2]=$3;
}

{
    if ($4~/low/) curr="low";
    if ($4~/high/) curr="high";
    print $0,order[$1,curr]
}
