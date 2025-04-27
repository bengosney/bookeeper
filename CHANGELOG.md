## 1.3.0 (2025-04-27)

### Feat

- add mergify configuration for automatic merging of pull requests by author
- **Book**: add 'removed' field to Book interface and update related components
- **ISBNInput**: add ISBN input component and routing
- **BookList**: add author search functionality to book filtering
- **dashboard**: animate the total number up to hide the delay in getting the total
- **settings**: Add the version and build date to the settings
- **service-worker**: full off-line support

### Fix

- **pouchSync**: ensure correct URL construction for remote database connection
- **BookItem**: handle optional authors and improve link fallback
- **BookList**: correctly search authors
- **BookList**: correct author field in book search functionality
- remove credentials

### Refactor

- **BookList**: optimize query construction and fix search filter logic
- **BookItem**: simplify class name assignment logic
- **books**: remove pointless function
- **types**: tighten up the typing of docs
- **linting**: remove a load of unused imports and other linting

## 1.2.0 (2024-09-04)

### Feat

- **icons**: add an icon and properly fillout the meta data

## 1.1.0 (2024-09-04)

### Feat

- **css**: improve details styling
- **settings**: improve the styling of the settings page
- **input**: much better input style
- **dashboard**: add a simple dashboard

### Fix

- **covers**: remove the protocol from the images

## 1.0.0 (2023-03-31)
