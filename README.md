# FAMILY FITNESS TRACKER

## Overview
The Family Fitness Tracker is a simple app to help members of a family get into shape.
The premise is simple: each day, each member of the family answers 3 basic questions:
1. Did you eat a healthy balance of foods?
2. Did you eat an appropriate number of calories?
3. Did you exercise vigorously for at least 30 minutes?

Based on their answers to these questions, they will earn the following number of points for the day:
3 yes responses = 5 points
2 yes responses = 3 points
0-1 yes responses = 0 points

## Technologies
The system has an HTML page (index.html) that contains the basic page structure. There is an empty div on that page that is populated via javascript. The data is contained in a json file (fitness.json).

## File Structure
index.html - contains the basic website HTML.
fitness.json - contains the data for the system.
src directory - contains the javascript code.
     new_index.js - contains the javascript code to fetch the data from the server.
     display_data_screens.js - contains the javascript code to generate the screens that simply display the data.
     display_form_screens.js - contains the javascript code to generate the screens with forms on them (and to process those forms).
     data_functions.js - contains functions used to process data (i.e. calculateDailyScore, which takes a family member's log for a given day and calculates the appropriate score).
     display_functions.js - contains the functions that simplify generating screen views, combining multiple steps of code into single function calls.
css directory - contains the css file (index.css).

## Usage
From the home screen, click the menu icon and choose from the two options:
1. Show family members - lets the user see a list of family members. From there, the user can add/edit the names of family members.
2. Show overall scoreboard - brings the user to a screen showing the lifetime performance of each family member broken down by year.
    * Click on a year to see each member's performance broken down by month.
        * Click on a month to see a day by day breakdown of scores for the month.
            * On the score by date screen, there is a link to answer each family member's questions for the current and previous days. Once two days have passed, entries cannot be made or edited.