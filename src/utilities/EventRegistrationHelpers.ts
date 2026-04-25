import { EventConfig } from "@src/interfaces";

export const GetRegistrationPassTypes = (
  config: EventConfig,
  tierIds?: string[]
) => {
  return config.PASS_TYPES.filter((passType) => {
    let shown = true;

    if (passType.allowedTiersIds.length > 0) {
      if (!tierIds || tierIds.length === 0) {
        return false;
      }

      shown = passType.allowedTiersIds.some((tierId) =>
        tierIds.includes(tierId)
      );
    }

    return shown;
  });
};

export const GetPassType = (config: EventConfig, passTypeId: string) => {
  return config.PASS_TYPES.find((passType) => passType.id === passTypeId);
};

export const GetPackage = (config: EventConfig, packageId: string) => {
  return config.PACKAGES.find((pkg) => pkg.id === packageId);
};

export const GetAddOn = (config: EventConfig, addOnId: string) => {
  return config.ADD_ONS.find((addOn) => addOn.id === addOnId);
};

export const GetRoomType = (config: EventConfig, roomTypeId: string) => {
  return config.ROOM_TYPES.find((roomType) => roomType.id === roomTypeId);
};

export const GetSection = (config: EventConfig, sectionId: string) => {
  return config.SECTIONS.find((section) => section.id === sectionId);
};

export const GetQuestion = (config: EventConfig, questionId: string) => {
  return config.QUESTIONS.find((question) => question.id === questionId);
};

export const GetRegistrationPassTypeAddOns = (
  config: EventConfig,
  passTypeId: string,
  tierIds?: string[]
) => {
  return config.ADD_ONS.filter((addOn) => {
    let shown = true;

    if (shown && addOn.allowedPassTypesIds.length > 0) {
      shown = addOn.allowedPassTypesIds.some((id) => id === passTypeId);
    }

    if (shown && addOn.allowedTiersIds.length > 0) {
      if (!tierIds || tierIds.length === 0) {
        return false;
      }

      shown = addOn.allowedTiersIds.some((tierId) => tierIds.includes(tierId));
    }

    if (shown && addOn.disallowedTiersIds.length > 0) {
      shown = !addOn.disallowedTiersIds.some((tierId) =>
        tierIds?.includes(tierId)
      );
    }

    return shown;
  });
};

export const GetRegistrationAvailableRoomTypes = (
  config: EventConfig,
  passTypeIds: string[],
  tierIds?: string[]
) => {
  return config.ROOM_TYPES.filter((roomType) => {
    let shown = true;

    if (shown && roomType.passTypesIds.length > 0) {
      shown = roomType.passTypesIds.some((id) => passTypeIds.includes(id));
    }

    if (shown && roomType.allowedTiersIds.length > 0) {
      if (!tierIds || tierIds.length === 0) {
        return false;
      }

      shown = roomType.allowedTiersIds.some((id) => tierIds.includes(id));
    }

    if (shown && roomType.disallowedTiersIds.length > 0) {
      shown = !roomType.disallowedTiersIds.some((id) => tierIds?.includes(id));
    }

    return shown;
  });
};

export const GetRegistrationPassSections = (
  config: EventConfig,
  passTypeId: string,
  addOnIds: string[],
  tierIds?: string[]
) => {
  return config.SECTIONS.filter((section) => {
    let shown = true;

    if (shown && section.passTypeIds.length > 0) {
      shown = section.passTypeIds.some((id) => passTypeId === id);
    }

    if (shown && section.accountTiersIds.length > 0) {
      if (!tierIds || tierIds.length === 0) {
        return false;
      }

      shown = section.accountTiersIds.some((id) => tierIds.includes(id));
    }

    if (shown && section.disallowedTiersIds.length > 0) {
      shown = !section.disallowedTiersIds.some((id) => tierIds?.includes(id));
    }

    if (shown && section.eventAddOnsIds.length > 0) {
      shown = section.eventAddOnsIds.some((id) => addOnIds.includes(id));
    }

    if (shown && section.questionIds.length === 0) {
      shown = false;
    }

    return shown;
  });
};

