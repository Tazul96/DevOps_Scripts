"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, ChevronLeft, ChevronRight, LayoutDashboard, MessageSquare, Users, CalendarDays, CreditCard, ShoppingBag, FileText, Settings, HelpCircle, User, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar)

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: MessageSquare, label: 'Message' },
  { icon: Users, label: 'Employee' },
  { icon: CalendarDays, label: 'Schedule' },
  { icon: CreditCard, label: 'Payment' },
  { icon: ShoppingBag, label: 'Shop' },
  { icon: FileText, label: 'Report' },
  { icon: Settings, label: 'Settings' },
]

export default function AbexitaSchedule() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Appointment with Doctor',
      start: new Date(2024, 9, 10, 8, 0),
      end: new Date(2024, 9, 10, 9, 0),
      resourceId: 1,
    },
    {
      id: 2,
      title: 'Group Meeting',
      start: new Date(2024, 9, 10, 9, 0),
      end: new Date(2024, 9, 10, 10, 0),
      resourceId: 2,
    },
  ])
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState(Views.WEEK)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    date: '',
    startTime: '',
    endTime: '',
    eventType: '',
    eventName: '',
    description: '',
  })

  const eventStyleGetter = useCallback((event) => {
    let style = {
      backgroundColor: '#E9F0FD',
      color: '#3366FF',
      border: 'none',
      borderRadius: '8px',
    }
    if (event.resourceId === 2) {
      style.backgroundColor = '#E7F9F0'
      style.color = '#00A76F'
    }
    return { style }
  }, [])

  const handleSelectSlot = useCallback(({ start, end }) => {
    setNewEvent({
      date: moment(start).format('D MMMM YYYY'),
      startTime: moment(start).format('HH:mm A'),
      endTime: moment(end).format('HH:mm A'),
      eventType: '',
      eventName: '',
      description: '',
    })
    setIsModalOpen(true)
  }, [])

  const handleCreateEvent = useCallback(() => {
    const { date, startTime, endTime, eventName, description, eventType } = newEvent
    if (!date || !startTime || !endTime || !eventName) {
      // Show an error message or handle incomplete input
      return
    }
    const start = moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm').toDate()
    const end = moment(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm').toDate()

    setEvents((prevEvents) => [...prevEvents, {
      id: prevEvents.length + 1,
      title: eventName,
      start,
      end,
      description,
      resourceId: eventType === 'appointment' ? 1 : 2, // Set resourceId based on event type
    }])

    setIsModalOpen(false)
    setNewEvent({
      date: '',
      startTime: '',
      endTime: '',
      eventType: '',
      eventName: '',
      description: '',
    })
  }, [newEvent])

  const moveEvent = useCallback(({ event, start, end }) => {
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id) ?? {}
      const filtered = prev.filter((ev) => ev.id !== event.id)
      return [...filtered, { ...existing, start, end }]
    })
  }, [])

  const resizeEvent = useCallback(({ event, start, end }) => {
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id) ?? {}
      const filtered = prev.filter((ev) => ev.id !== event.id)
      return [...filtered, { ...existing, start, end }]
    })
  }, [])

  const handleNavigate = useCallback((action) => {
    setDate(prevDate => {
      switch (action) {
        case 'TODAY':
          return new Date()
        case 'PREV':
          return view === Views.MONTH
            ? moment(prevDate).subtract(1, 'month').toDate()
            : view === Views.WEEK
            ? moment(prevDate).subtract(1, 'week').toDate()
            : moment(prevDate).subtract(1, 'day').toDate()
        case 'NEXT':
          return view === Views.MONTH
            ? moment(prevDate).add(1, 'month').toDate()
            : view === Views.WEEK
            ? moment(prevDate).add(1, 'week').toDate()
            : moment(prevDate).add(1, 'day').toDate()
        default:
          return prevDate
      }
    })
  }, [view])

  const handleViewChange = useCallback((newView) => {
    setView(newView)
  }, [])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'D' || event.key === 'd') {
        setView(Views.DAY)
      } else if (event.key === 'W' || event.key === 'w') {
        setView(Views.WEEK)
      } else if (event.key === 'M' || event.key === 'm') {
        setView(Views.MONTH)
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-60 bg-white shadow-md flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            Ab
          </div>
          <span className="text-xl font-bold">ABEXITA</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant={item.label === 'Schedule' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help and support
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Account
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">My Schedule</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search in schedule"
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 w-64"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                  stroke="#9DA4AE"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Bell className="text-gray-600" />
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Calendar controls */}
        <div className="bg-white p-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => handleNavigate('TODAY')}>Today</Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleNavigate('PREV')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleNavigate('NEXT')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">{moment(date).format('D MMMM YYYY')}</span>
          </div>
          <Select value={view} onValueChange={handleViewChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Views.MONTH}>Monthly</SelectItem>
              <SelectItem value={Views.WEEK}>Weekly</SelectItem>
              <SelectItem value={Views.DAY}>Daily</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
            + Add New
          </Button>
        </div>

        {/* Calendar */}
        <div className="flex-1 p-4 bg-white">
          <DnDCalendar
            localizer={localizer}
            events={events}
            onEventDrop={moveEvent}
            onEventResize={resizeEvent}
            resizable
            selectable
            onSelectSlot={handleSelectSlot}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 180px)' }}
            date={date}
            view={view}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={() => ({
              style: {
                backgroundColor: 'white',
              },
            })}
          />
        </div>
      </div>

      {/* Create Event Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5" />
        Create New Event
      </DialogTitle>
    </DialogHeader>
    <Tabs defaultValue="basic-details">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic-details">Basic Details</TabsTrigger>
        <TabsTrigger value="guest-link">Add Guest & Link</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="basic-details">
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newEvent.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newEvent.date ? format(new Date(newEvent.date), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newEvent.date ? new Date(newEvent.date) : undefined}
                  onSelect={(date) => setNewEvent({ ...newEvent, date: date ? date.toISOString() : '' })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
              <Select value={newEvent.startTime} onValueChange={(value) => setNewEvent({ ...newEvent, startTime: value })}>
                <SelectTrigger id="startTime">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {`${hour.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
              <Select value={newEvent.endTime} onValueChange={(value) => setNewEvent({ ...newEvent, endTime: value })}>
                <SelectTrigger id="endTime">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {`${hour.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">Type of Event</label>
            <Select value={newEvent.eventType} onValueChange={(value) => setNewEvent({ ...newEvent, eventType: value })}>
              <SelectTrigger id="eventType">
                <SelectValue placeholder="Select a event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
            <Input
              id="eventName"
              value={newEvent.eventName}
              onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
              placeholder="Type event name"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="guest-link">
        <div className="p-4 text-center text-gray-500">
          Guest & Link features coming soon
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-4 text-center text-gray-500">
          Settings features coming soon
        </div>
      </TabsContent>
    </Tabs>
    <div className="flex justify-end gap-4 mt-6">
      <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
      <Button onClick={handleCreateEvent}>Book Appointment</Button>
    </div>
  </DialogContent>
</Dialog>
    </div>
  )
}