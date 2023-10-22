This file mainly based on nodejs application

===========================================================================================
#Single stage Image build from dockerfile
===========================================================================================

	#Step 1: Build the application
		FROM node:18.12.1-alpine 

	# Step 2: Create a working directory where all activities happend
		WORKDIR /app

	#Step-3: Copy only the package files to leverage Docker cache
		COPY package.json ./

	#Step-4:Install dependencies
		RUN npm install

	#Step-5: Copy the entire application and other files
		COPY . .

	#Step-6: Expose the server's port (assuming your server runs on port 3000)
		EXPOSE 3000
	
	#Step-7: Start the Node.js server for SSR
		CMD ["node","index.js"]

===========================================================================================
#Multi-Stage Image build to reduce size
===========================================================================================


#Stage 1
	#Step 1: Build the application
		FROM node:18.12.1-alpine as build-stage

	# Step 2: Create a working directory where all activities happend
		WORKDIR /app

	#Step-3: Copy only the package files to leverage Docker cache
		COPY package.json ./

	#Step-4:Install dependencies
		RUN npm install

	#Step-5: Copy the entire application and other files
		COPY . .

	#Step-6: Build the image
		RUN npm run build
		
		

#Stage 2: 
	#Step1: Create a lightweight runtime image. Choose only one
		#Option 1: Using base Image
			FROM node:18.12.1-alpine
		
		#Option 2: Using slim images
			FROM node:18-slim
		
		#Option 3: Usiing Distroless Image
			FROM gcr.io/distroless/nodejs18-debian11

	#Step2: Create a working directory where all final image store
		    WORKDIR /app

	#Step 3: Copy only necessary files for runtime (including built artifacts). Choose any of them. 
		
        #Option 1: copying all files in the build stage
			COPY --from=build-stage /app .
			
		#Option 2: Copying only necessasry files (Adjust according to project)
			COPY --from=build /usr/src/app/package*.json ./
			COPY --from=build /usr/src/app/build ./build
			COPY --from=build /usr/src/app/server.js ./
		
	#Step 4: If choose second option from "stage 2 >> Step 3" to reduce file size. Install only production dependencies again
		    RUN npm install --only=production

    #Step-5: Expose the server's port (assuming your server runs on port 3000)
	        EXPOSE 3000

    #Step-6: Start the Node.js server for SSR
	        CMD ["npm","run","dev"]

===========================================================================================
# Make screct the .ENV file
===========================================================================================

FROM node:18.12.1-alpine 

    WORKDIR /app

    COPY package.json ./

    ARG PROD_ENV_FILE
    RUN echo "$PROD_ENV_FILE" > .env.local

    RUN npm install -f

    COPY . .

    EXPOSE 3000

    CMD ["npm","run","dev"]