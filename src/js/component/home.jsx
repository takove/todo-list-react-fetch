import React, { useEffect, useState } from "react";

function Home () {	
	const [inputValue, setInputValue] = useState('')
	const [newTasks, setNewTasks] = useState([])
	const [pending, setPending] = useState(true)
	const [userReady, setUserReady] = useState()
	
	let user = "https://assets.breatheco.de/apis/fake/todos/user/luiss"

	const isUserReady = async () => {
		try {
			let response = await fetch(user)
			if (response.ok) {
				setUserReady(true),
				console.log('User is already created isUserReady')
				const body = await response.json()
				setPending(false)
				setNewTasks(body)
			}
			else (
				setUserReady(false),
				console.log('User is not created')
			)
		}
		catch {
			error => console.log(error)
		}
	}
	

	const userCreation = async () => {
		try {
			let response = await fetch(user,{
				method: "POST",
				body: JSON.stringify([]),
				headers: {"Content-Type" : "application/json"}
			})
			if (response.ok) {
				console.log('user created succesfully') //should be replaced with GET to get the user's tasks
				setUserReady(true)
			}
			
		} catch (error) {
			console.log(error)			
		}

	}
	

	// submit function
	async function submit (event) {
		try {
			if (event.key === 'Enter' && inputValue.trim() !== "") {
				if (newTasks.length === 0) {
					setPending(true)
				}
				else {
					setPending(false)
				}
				let body = [...newTasks, {"label": inputValue, "done": false}]
				const response = await fetch(user, {
					method: "PUT",
					body: JSON.stringify(body),
					headers: {"Content-Type": "application/json"}
				})
				
				if(response.ok) {
					await isUserReady()
					setInputValue('')
					return response.json()
				}
				else{
					console.log('Something unexpected happened')
				}
				
			}
		} catch (error) {
			console.log(error)
		}
		
	}
	// deleting function
	async function deleteTask (i) {
		const newTask = newTasks.filter((task, index) => {
			if (i == index) {
				return false
			}
			return true
		})
			if (newTask.length === 0) {
				deleteUser()
				setPending (true)

		}
			setNewTasks(newTask)
			
	}
	// delete all tasks and user
	async function deleteUser () {
		try {
			const response = await fetch (user, {
				method: "DELETE",
				headers: {"Content-Type": "application/json"}
			})
			console.log(response)
			if (response.ok) {
				await userCreation()
				await isUserReady()
			}
		} catch {
			error => console.log(error)
		}
	}

	const Mapping = newTasks.map((task, index) => {
		return (
			<li key={index} className='my-2 list-group-item taskDeleteButtonHover'>
				{task.label}
				<button className="btn-close btn-close-dark float-end taskDeleteButton" key={index} type="button" onClick={(event) => deleteTask(index)} ></button>
			</li>
		)
	})

	useEffect(() => {
		if (userReady === false) {
		userCreation()
	}}, [userReady])

	useEffect(() => {
		isUserReady()
	}, [])
	
	// display
	return (
		<div className="container-fluid">  {/* main frame */}
			<div> {/* THIS ONE IS A VALID COMMENT */}
				<div className=" row col-10 col-sm-8 col-md-7 col-lg-6 mx-auto justify-content-center text-center">
					<h1>home tasks to do</h1>
					<button className="btn my-3" onClick={(e) => {deleteUser()}}>Click to delete all tasks</button>
				</div>
				<div className="row col-10 col-sm-8 col-md-7 col-lg-6 mx-auto justify-content-center">
					<input type="text"
					name=""
					id="taskMaker"
					placeholder="add a todo task"
					onChange={(event) => {
						setInputValue(event.target.value)
					}}
					onKeyDown={submit}
					value={inputValue}/>
					
				</div>
				<div>
					{pending ? (
						<div className="row col-10 col-sm-8 col-md-7 col-lg-6 mx-auto justify-content-center">
							no tasks left, add some to organize your lifestyle
						</div>) : (
							<div>
								<ul className="row col-10 col-sm-8 col-md-7 col-lg-6 mx-auto justify-content-center ps-0">
									{Mapping}
								</ul>
								<div className="row col-10 col-sm-8 col-md-7 col-lg-6 mx-auto justify-content-center">You have {newTasks.length} tasks left</div>	
							</div>			
						)}
				</div>
			</div>			 
		</div>
	)
	
}
export default Home;
