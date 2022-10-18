# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

1. Add Custom ID map table
Description: Create a table `FacilityAgentIds` with columns: 
 - `facility_id` - `unsigned big int`,
 - `agent_id` - `unsigned big int`,
 - `custom_id` - `varchar (255)`.
Add primary key [`facility_id`, `agent_id`].
Add unique index [`facility_id`, `agent_id`, `custom_id`]
Acceptance: `FacilityAgentIds` table with proper column types and indicies created in database.
Estimate: 1 hour

2. Add endpoint to set `custom_id` for Agents
Description: Create an endpoint that accepts object with 3 properties: `facility_id`, `agent_id`, `custom_id`. Add validation rules: 
 - `facility_id`: required integer, exists `Facilities.id`;
 - `agent_id`: required integer, exists `Agents.id`
 - `custom_id` - required string.
 Make an upsert query: if there is no  [`facility_id`, `agent_id`] pair in db than just insert new row or update `custom_id` otherwise. If query fails with unique key violation than return Validation error: `Id <ID_HERE> is already taken`
 Acceptance: `custom_id` can be set for any existing agent and facility pair. If `custom_id` already exists for such [`facility_id`, `agent_id`] pair validation error should be thrown
 Estimate: 5 hours

3. Update fetching Shifts
Description: Join `FacilityAgentIds` by `agent_id` and `facility_id` when fetching Agents in `getShiftsByFacility`. and include `custom_id` field to Agent metadata. If agent has `custom_id` than write it to `id` field in agent's metadata instead of real database id
Acceptance: `getShiftsByFacility` returns `custom_id` instead of db internal id in Agent`s metadata if it has one.
Estimate: 1 hour
