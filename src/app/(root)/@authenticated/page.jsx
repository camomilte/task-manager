"use client"

import { Header } from '@/components/header';
import { TaskCol } from '@/components/tasks/task-col';
import { useAuth } from '@/context/authContext';

import { isValid, parse } from "date-fns";
import { useSearchParams } from "next/navigation";

function HomePage() {

  const searchParams = useSearchParams()
  const date = searchParams.get("date")
  const parsed = date ? parse(date, "yyyy-MM-dd", new Date()) : new Date();

  const selectedDate = isValid(parsed) ? parsed : new Date;

  const { user } = useAuth();

  return (
    <div className='mt-3 md:mt-10'>
      <Header />
      <div className='mt-10'>
        <TaskCol date={selectedDate} user={user}/>
      </div>
    </div>
  )
};

export default HomePage;
