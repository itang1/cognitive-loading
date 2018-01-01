# THis assigns categories
# IMPT: if this hangs, ctrl-c and rerun
# (there are some impossible assignments)
# the chance of hanging is 1/numcategories

# there should be eight conditions
# quantifier superset subset (overlap)
# quantifier subset superset (overlap)
# quantifier superset subset (no overlap)
# quantifier subset superset (no overlap)
# quants={Not_all, No, Some, All}

BEGIN{ itemspercat=8;}

$1!="" { 
  cats[++totalcats]=$1;
  for (i=2;i<=NF;i++) assignment[$i]=$1;
}

END{
  srand();
# Generate an item from each exemplar
  for (i in assignment) {
    count++;

# Wrong category gets randomly assigned
    goodcat="";
    while (goodcat=="") {
      element=1+int(rand()*totalcats);
      if ((assignment[i]!=cats[element]) && wrongsubsets[cats[element]] < itemspercat) goodcat=1;
    }
# Type T1    
    print "# verif18 " count " some_subset";
    print "Some " i " are " assignment[i]".";
    print "! True or False? {TRUE FALSE} {TRUE FALSE}";
    print "";
# Type T2    
    print "# verif18 " count " some_superset";
    print "Some " assignment[i] " are " i ".";
    print "! True or False? {TRUE FALSE} {TRUE}";
    print "";
# Type T3    
    print "# verif18 " count " some_wrongsubset";
    print "Some " i " are " cats[element]".";
    print "! True or False? {TRUE FALSE} {FALSE}";
    print "";

# Type T1 all    
    print "# verif18 " count " all_subset";
    print "All " i " are " assignment[i]".";
    print "! True or False? {TRUE FALSE} {TRUE}";
    print "";
# Type T2    
    print "# verif18 " count " all_superset";
    print "All " assignment[i] " are " i ".";
    print "! True or False? {TRUE FALSE} {FALSE}";
    print "";
# Type T3    
    print "# verif18 " count " all_wrongsubset";
    print "All " i " are " cats[element]".";
    print "! True or False? {TRUE FALSE} {FALSE}";
    print "";

# Type T1 notal_    
    print "# verif18 " count " notal_subset";
    print "Not_all " i " are " assignment[i]".";
    print "! True or False? {TRUE FALSE} {FALSE}";
    print "";
# Type T2    
    print "# verif18 " count " notal_superset";
    print "Not_all " assignment[i] " are " i ".";
    print "! True or False? {TRUE FALSE} {TRUE}";
    print "";
# Type T3    
    print "# verif18 " count " notal_wrongsubset";
    print "Not_all " i " are " cats[element]".";
    print "! True or False? {TRUE FALSE} {TRUE FALSE}";
    print "";

# Type T1 none    
    print "# verif18 " count " none_subset";
    print "No " i " are " assignment[i]".";
    print "! True or False? {TRUE FALSE} {FALSE}";
    print "";
# Type T2    
    print "# verif18 " count " none_superset";
    print "No " assignment[i] " are " i ".";
    print "! True or False? {TRUE FALSE} {FALSE}";
    print "";
# Type T3    
    print "# verif18 " count " none_wrongsubset";
    print "No " i " are " cats[element]".";
    print "! True or False? {TRUE FALSE} {TRUE}";
    print "";

    wrongsubsets[cats[element]]++;
  }
# THis checks to make sure that same num of trials per wrongsubset 
#  for (i in wrongsubsets) print i,wrongsubsets[i];
}
