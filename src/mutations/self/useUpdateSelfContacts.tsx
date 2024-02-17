import { ConnectedXM } from "@context/api/ConnectedXM";
import * as Contacts from "expo-contacts";
import phone from "phone";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface EmailPhone {
  email?: string;
  phone?: string;
}

interface UpdateSelfContactsParams extends MutationParams {}

export const UpdateSelfContacts = async (_: UpdateSelfContactsParams) => {
  const emailPhones: EmailPhone[] = [];

  const contacts = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
  });

  for (const contact of contacts.data) {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      contact.phoneNumbers.forEach((number) => {
        if (number.number) {
          const num = phone(number.number);
          if (num.isValid) {
            emailPhones.push({
              email: undefined,
              phone: num.phoneNumber,
            });
          }
        }
      });
    }

    if (contact.emails && contact.emails.length > 0) {
      contact.emails.forEach((email) => {
        emailPhones.push({
          email: email.email,
          phone: undefined,
        });
      });
    }
  }

  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/self/contacts`, emailPhones);

  return data;
};

export const useUpdateSelfContacts = () => {
  return useConnectedMutation<UpdateSelfContactsParams>(UpdateSelfContacts, {});
};

export default useUpdateSelfContacts;
