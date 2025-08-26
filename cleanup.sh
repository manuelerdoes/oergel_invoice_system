#!/bin/bash

CSV_TOOGLE=$1

rm *.pdf
rm mrmd*.md

if [ "$CSV_TOGGLE" == "-c" ]; then rm *.csv; fi #$CSV_TOGGLE 