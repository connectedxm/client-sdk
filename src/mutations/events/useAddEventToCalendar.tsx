import { BaseEvent, Event, Organization } from "@context/interfaces";
import useGetEvent from "@context/queries/events/useGetEvent";
import useGetOrganization from "@context/queries/organization/useGetOrganization";
import { useMutation } from "@tanstack/react-query";
import { getLocationString } from "@utilities/GetLocationString";
import * as Calendar from "expo-calendar";

interface AddEventToCalendarParams {
  event?: Event | BaseEvent;
  organization?: Organization;
}

export const AddEventToCalendar = async ({
  event,
  organization,
}: AddEventToCalendarParams) => {
  if (!event || !organization) throw Error("Loading...");

  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status === "granted") {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();

    const events = await Calendar.getEventsAsync(
      [defaultCalendar.id],
      new Date(event.eventStart),
      event.eventEnd ? new Date(event.eventEnd) : new Date(event.eventStart)
    );

    if (!events.some((ev) => ev.id === event.id)) {
      const eventConfig: Calendar.Event = {
        id: event.id,
        calendarId: defaultCalendar.id,
        title: event.name,
        startDate: new Date(event.eventStart),
        endDate: event.eventEnd
          ? new Date(event.eventEnd)
          : new Date(event.eventStart),
        location: getLocationString(event),
        notes: event.shortDescription,
        organizer: organization.name,
        organizerEmail: organization.email,
        timeZone: event.timezone || "America/Denver",
        allDay: false,
        availability: "BUSY",
        status: "CONFIRMED",
        recurrenceRule: null as any,
        alarms: [
          { method: Calendar.AlarmMethod.ALERT, relativeOffset: -24 * 60 },
        ],
      };

      await Calendar.createEventAsync(defaultCalendar.id, eventConfig);
    }
  }
};

export const useAddEventToCalendar = (eventId: string = "") => {
  const { data: event } = useGetEvent(eventId);
  const { data: organization } = useGetOrganization();

  return useMutation<any>(
    () =>
      AddEventToCalendar({
        event: event?.data,
        organization: organization?.data,
      }),
    {}
  );
};

export default useAddEventToCalendar;
