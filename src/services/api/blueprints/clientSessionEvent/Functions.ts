// Types
import {ClientSessionEventType} from '@services/api/swagger/data-contracts';
// Functions
import {insertClientSessionEvent} from '@services/db/clientSessionEvent/Functions';

export const handleClientSessionEvent = async (
  eventType: ClientSessionEventType,
) => await insertClientSessionEvent(eventType);
