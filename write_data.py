#!/usr/bin/python

import cgi
import smtplib
import sys
import traceback
import yaml
import datetime
import cgitb

def main():
    try:
        print "Content-type: text/json\n"
        print "{\"status\": \"ok\"}"

        content = sys.stdin.read()
        parsed_data = (content)

        f = open("../../results/ratings/TEST","w") 
        f.write(parsed_data)
        f.close()
    except:
        f = open("../../results/ratings/TEST","w")
        f.write("Error saving participant data.")
        f.close() 
    
main()
