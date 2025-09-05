# Searchlist SDK Implementation Guide

## Overview

The ConnectedXM Client SDK now includes comprehensive searchlist functionality that replaces the existing searchvalues system for search-type questions. This new implementation provides enhanced capabilities for managing searchlists connected to registration, event session, and survey questions.

## 🆕 What's New

### Enhanced Data Structure
- **Searchlists** now include metadata like name and creation timestamps
- **Searchlist Values** support prioritization with a `top` flag for featured options
- Full pagination and search capabilities across all endpoints
- Type-safe interfaces with comprehensive TypeScript support

### Broader Coverage
- Event registration questions
- Event session questions  
- Survey questions
- General searchlist management

## 📋 Core Interfaces

```typescript
interface SearchListValue {
  id: string;
  value: string;
  top: boolean;        // Indicates if this is a priority/featured value
  createdAt: string;
  updatedAt: string;
}

interface SearchList {
  id: string;
  name: string;
  values: SearchListValue[];
  createdAt: string;
  updatedAt: string;
}
```

## 🔍 Query Hooks

### General Searchlist Queries

#### `useGetSearchLists(params?, options?)`
Get a paginated list of all searchlists.

```typescript
const { data, fetchNextPage, hasNextPage } = useGetSearchLists({
  search: "location",     // Optional: search by name
  pageSize: 20           // Optional: items per page
});
```

#### `useGetSearchList(searchListId, options?)`
Get a specific searchlist by ID.

```typescript
const { data: searchList } = useGetSearchList("searchlist-id");
```

#### `useGetSearchListValues(searchListId, params?, options?)`
Get paginated values for a specific searchlist.

```typescript
const { data, fetchNextPage } = useGetSearchListValues("searchlist-id", {
  search: "new york",    // Optional: search within values
  top: true,            // Optional: only get priority values
  pageSize: 50
});
```

### Question-Specific Searchlist Queries

#### Event Registration Questions
```typescript
// Get the searchlist for an event registration question
const { data: searchList } = useGetEventQuestionSearchList(eventId, questionId);

// Get searchable values for the question
const { data: values } = useGetEventQuestionSearchListValues(eventId, questionId, {
  search: "search term",
  top: true  // Only priority values
});
```

#### Event Session Questions
```typescript
// Get the searchlist for an event session question
const { data: searchList } = useGetEventSessionQuestionSearchList(
  eventId, 
  sessionId, 
  questionId
);

// Get searchable values for the session question
const { data: values } = useGetEventSessionQuestionSearchListValues(
  eventId, 
  sessionId, 
  questionId,
  { search: "search term" }
);
```

#### Survey Questions
```typescript
// Get the searchlist for a survey question
const { data: searchList } = useGetSurveyQuestionSearchList(surveyId, questionId);

// Get searchable values for the survey question
const { data: values } = useGetSurveyQuestionSearchListValues(surveyId, questionId, {
  search: "search term",
  pageSize: 25
});
```

## 🔄 Mutation Hooks

### Answering Questions with Searchlist Values

#### Event Registration
```typescript
const updateRegistrationResponse = useUpdateSelfEventRegistrationSearchListResponse({
  onSuccess: () => {
    // Handle success
    console.log('Registration response updated');
  }
});

// Answer a registration question
updateRegistrationResponse.mutate({
  eventId: "event-123",
  passId: "pass-456", 
  questionId: "question-789",
  searchListValueId: "value-abc"  // ID of the selected searchlist value
});
```

#### Event Session Registration
```typescript
const updateSessionResponse = useUpdateSelfEventSessionRegistrationSearchListResponse();

updateSessionResponse.mutate({
  eventId: "event-123",
  sessionId: "session-456",
  passId: "pass-789",
  questionId: "question-abc",
  searchListValueId: "value-def"
});
```

#### Survey Response
```typescript
const updateSurveyResponse = useUpdateSurveySearchListResponse();

updateSurveyResponse.mutate({
  surveyId: "survey-123",
  submissionId: "submission-456",
  questionId: "question-789", 
  searchListValueId: "value-abc"
});
```

## 💡 Implementation Examples

### Basic Searchable Dropdown Component

```typescript
import React, { useState } from 'react';
import { useGetEventQuestionSearchListValues } from '@connectedxm/client-sdk';

interface SearchableDropdownProps {
  eventId: string;
  questionId: string;
  onSelect: (valueId: string) => void;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  eventId,
  questionId,
  onSelect
}) => {
  const [search, setSearch] = useState('');
  
  const { data, fetchNextPage, hasNextPage, isLoading } = 
    useGetEventQuestionSearchListValues(eventId, questionId, {
      search,
      pageSize: 20
    });

  const allValues = data?.pages.flatMap(page => page.data) || [];

  return (
    <div className="searchable-dropdown">
      <input
        type="text"
        placeholder="Search options..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      
      <div className="options-list">
        {/* Priority/Top values first */}
        {allValues
          .filter(value => value.top)
          .map(value => (
            <div 
              key={value.id} 
              className="option priority"
              onClick={() => onSelect(value.id)}
            >
              ⭐ {value.value}
            </div>
          ))
        }
        
        {/* Regular values */}
        {allValues
          .filter(value => !value.top)
          .map(value => (
            <div 
              key={value.id} 
              className="option"
              onClick={() => onSelect(value.id)}
            >
              {value.value}
            </div>
          ))
        }
        
        {hasNextPage && (
          <button onClick={() => fetchNextPage()}>
            Load More...
          </button>
        )}
      </div>
    </div>
  );
};
```

### Complete Question Response Flow

```typescript
import React, { useState } from 'react';
import { 
  useGetEventQuestionSearchList,
  useGetEventQuestionSearchListValues,
  useUpdateSelfEventRegistrationSearchListResponse 
} from '@connectedxm/client-sdk';

interface QuestionResponseProps {
  eventId: string;
  passId: string;
  questionId: string;
}

export const QuestionResponse: React.FC<QuestionResponseProps> = ({
  eventId,
  passId,
  questionId
}) => {
  const [selectedValueId, setSelectedValueId] = useState<string>('');
  const [search, setSearch] = useState('');

  // Get the searchlist metadata
  const { data: searchList } = useGetEventQuestionSearchList(eventId, questionId);
  
  // Get searchable values
  const { data: valuesData, isLoading } = useGetEventQuestionSearchListValues(
    eventId, 
    questionId, 
    { search, pageSize: 50 }
  );

  // Mutation for submitting response
  const updateResponse = useUpdateSelfEventRegistrationSearchListResponse({
    onSuccess: () => {
      alert('Response saved successfully!');
    },
    onError: (error) => {
      console.error('Failed to save response:', error);
    }
  });

  const handleSubmit = () => {
    if (selectedValueId) {
      updateResponse.mutate({
        eventId,
        passId,
        questionId,
        searchListValueId: selectedValueId
      });
    }
  };

  const allValues = valuesData?.pages.flatMap(page => page.data) || [];

  return (
    <div className="question-response">
      <h3>{searchList?.name}</h3>
      
      <input
        type="text"
        placeholder="Search options..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <div>Loading options...</div>
      ) : (
        <div className="options">
          {allValues.map(value => (
            <label key={value.id} className="option">
              <input
                type="radio"
                name="searchlist-value"
                value={value.id}
                checked={selectedValueId === value.id}
                onChange={() => setSelectedValueId(value.id)}
              />
              {value.top && '⭐ '}{value.value}
            </label>
          ))}
        </div>
      )}

      <button 
        onClick={handleSubmit}
        disabled={!selectedValueId || updateResponse.isPending}
      >
        {updateResponse.isPending ? 'Saving...' : 'Save Response'}
      </button>
    </div>
  );
};
```

## 🎯 Key Benefits

### For Users
- **Faster Search**: Real-time search across searchlist values
- **Priority Options**: Important values marked with `top: true` for quick access
- **Better UX**: Pagination prevents overwhelming dropdowns with thousands of options

### For Developers  
- **Type Safety**: Full TypeScript support with proper interfaces
- **Consistent API**: Same patterns across events, sessions, and surveys
- **Performance**: Efficient pagination and search reduce payload sizes
- **Cache Management**: Automatic query invalidation keeps data fresh

## 🔄 Migration from SearchValues

### Before (SearchValues)
```typescript
// Old searchvalues approach
const { data } = useGetEventQuestionSearchValues(eventId, questionId);
// Limited to simple id/value pairs, no search, no pagination
```

### After (SearchLists)
```typescript
// New searchlist approach  
const { data } = useGetEventQuestionSearchListValues(eventId, questionId, {
  search: "new york",    // Built-in search
  top: true,            // Priority filtering
  pageSize: 20          // Pagination
});
// Rich data structure with metadata and enhanced capabilities
```

## 🚨 Important Notes

1. **Value IDs**: When submitting responses, use the `searchListValueId` (the ID of the selected value), not the searchlist ID itself.

2. **Priority Values**: Values with `top: true` should be displayed prominently (e.g., at the top of lists, with special styling).

3. **Search Performance**: Implement debouncing for search inputs to avoid excessive API calls.

4. **Error Handling**: All mutation hooks support `onError` callbacks for proper error handling.

5. **Cache Invalidation**: Mutations automatically invalidate related queries to keep the UI in sync.

## 📚 Available Hooks Summary

### Queries
- `useGetSearchLists` - All searchlists
- `useGetSearchList` - Single searchlist  
- `useGetSearchListValues` - Values for a searchlist
- `useGetEventQuestionSearchList` - Event question searchlist
- `useGetEventQuestionSearchListValues` - Event question values
- `useGetEventSessionQuestionSearchList` - Session question searchlist  
- `useGetEventSessionQuestionSearchListValues` - Session question values
- `useGetSurveyQuestionSearchList` - Survey question searchlist
- `useGetSurveyQuestionSearchListValues` - Survey question values

### Mutations
- `useUpdateSelfEventRegistrationSearchListResponse` - Answer event registration questions
- `useUpdateSelfEventSessionRegistrationSearchListResponse` - Answer session questions  
- `useUpdateSurveySearchListResponse` - Answer survey questions

## 🤝 Support

For questions or issues with the searchlist implementation, please reach out to the backend team or create an issue in the appropriate repository.

---

*This functionality is available immediately in the latest version of the ConnectedXM Client SDK.*
