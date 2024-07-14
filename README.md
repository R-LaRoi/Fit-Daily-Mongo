
# Fit Daily | SBA.v5 

Fit Daily is a web application built with Express.js that helps users track their daily fitness activities. It contains a RESTful API for handling data operations, and a user interface using PUG view engine. Users can interact with the application through a web browser to create, view and manage fitness routine history. 


### Objectives

- Create  routes for all data that should be visible to the client. 

    `GET /routines`
- Create route for client data creation. 
    
    `POST /submitRoutine` 
- Create route for data manipulation via `PUT` request.

    `PUT /submitRoutine/:id`
- Create `DELETE` routes for data category to allow for client deletion via a request.

    `DELETE /deleteRoutine/:id`

- Include a form within a rendered view that allows for interaction with your RESTful API. 

    `GET /addroutine`

- Create and use error-handling middleware.
 


### Features
- User login page
- Create a new routine, client can intereact with a form and select date, type, duration and activity.  
- View user routine history data.
- Modify an existing routine.
- Delete an exisiting routine. 



### Technologies Used 
- Node.js 
- Express.js 
- Pug: Template view engine
- NanoId: Node package to generate custom ids
- CSS 
- Font Awesome 

## Screenshots

![App Screenshot](https://github.com/user-attachments/assets/89eb5934-6fa5-42d3-9233-9ac494bacd9c)

![App Screenshot](https://github.com/user-attachments/assets/45850def-5122-4549-a6ea-ad812f3336ec)

![App Screenshot](https://github.com/user-attachments/assets/83538fba-aaf6-409c-8a2e-f16715f9f779)


## Run Locally

Clone the project

```bash
  git clone https://github.com/R-LaRoi/fit-daily-sba
```

Go to the project directory

```bash
  cd fit-daily-sba
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```
Open browser
```bash
 http://localhost:3000



