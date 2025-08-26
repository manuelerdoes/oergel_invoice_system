#!/bin/bash

CSV_TOGGLE=$1


rm -f *.pdf 2>/dev/null
rm -f mrmd*.md 2>/dev/null

if [ "$CSV_TOGGLE" == "-c" ]; then rm -f *.csv; fi 
