BEGIN{
    while ((getline < "badsubs")>0) {
	bad[$1]=1
    }
}
!($1 in bad){print}
