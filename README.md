# Dashboard For NYC Bike Sharing

This project was generated with WebPack.

## Installation
To install required package Run `npm install` in project folder, It will take around 5 min.

## Run Application
Run `npm run dev` to host application on local machine.

## Features
1. Map View
	Each bike station is represented by a marker on a map with the following colour coding:
	Red -> No free bikes
	Orange -> Less than 50% bikes available
	Green -> Greater than 75% bikes available
	 
	![alt text](https://image.ibb.co/bBxVx7/Default_View.png)	

2. Distance-based Query
	Given a station name and a distance in km, the query interface will whittle down the map
	view to only those stations that fall within “distance” from the target station.
	
	![alt text](https://image.ibb.co/dN3EPn/Filtered_Location.png)
	
3. Current Usage
	A graphical representation of the current usage of individual stations as well as a global
	view.
	![alt text](https://image.ibb.co/gKHVx7/Current_Usage_View.png)
	
4. Historical Usage
	A graphical representation of the minute-wise usage of individual stations as well as a global
	view. 
	
	![alt text](https://image.ibb.co/hkWZPn/Historical_Usage_View.png)

5. Search Bar
	The search bar (auto complete will be brilliant) enables the user to filter the above two
	usage views to a particular station by its name.
	
	![alt text](https://image.ibb.co/fdRZPn/Auto_Completer_Location_Selector.png)