"use server"
import { ID } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID } from "../appwrite.config";
import { parseStringify } from "../utils";


//  CREATE APPOINTMENT
export const createAppointment=async (appointment:CreateAppointmentParams)=>{
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
          )
          return parseStringify(newAppointment)
    } catch (error) {
        console.log(error)
    }
}

//  GET RECENT APPOINTMENTS
export const getAppointment = async (appointmentId:string) => {
    try {
     const appointment =await databases.getDocument(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        appointmentId,
     )
      return parseStringify(appointment);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the recent appointments:",
        error
      );
    }
  };