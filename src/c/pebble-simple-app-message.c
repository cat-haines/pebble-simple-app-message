#include <pebble.h>
#include "pebble-simple-app-message.h"
#include "pebble-events/pebble-events.h"
#include "@smallstoneapps/linked-list/linked-list.h"

typedef struct StringDictTuple {
  char *key;
  void *data;
} StringDictTuple;

static bool prv_string_dict_contains_key(void* obj, void* key) {
  return (strcmp(((StringDictTuple*) obj)->key, (char*) key) == 0);
}

static bool prv_string_dict_free_node(void* obj, void* context) {
  if (!obj) return true;

  StringDictTuple* tuple = obj;
  if (tuple->key) free(tuple->key);
  if (tuple->data) free(tuple->data);

  tuple->key = NULL;
  tuple->data = NULL;

  free(tuple);
  tuple = NULL;

  return true;
}

StringDict* string_dict_create() {
  StringDict* this = (StringDict*) linked_list_create_root();
  return this;
}

void string_dict_destroy(StringDict *this) {
  if (!this) return;
  LinkedRoot* root = (LinkedRoot*) this;
  linked_list_foreach(root, prv_string_dict_free_node, NULL);
  linked_list_clear(root);
  free(this);
  this = NULL;
}

void string_dict_write_data(StringDict* this, char* key, uint16_t length, void* data) {
  LinkedRoot* root = (LinkedRoot*) this;

  int16_t list_key = linked_list_find_compare(root, key, prv_string_dict_contains_key);
  StringDictTuple* tuple;

  if (list_key == -1) {
    tuple = malloc(sizeof(StringDictTuple));
    strcpy(tuple->key, key);
    linked_list_append(root, tuple);
  } else {
    tuple = linked_list_get(root, list_key);
    if (tuple->data) free(tuple->data);
  }

  if (length > 0) {
    tuple->data = malloc(length);
    memcpy(tuple->data, data, length);
  }
}

void string_dict_write_null(StringDict* this, char* key) {
  string_dict_write_data(this, key, 0, NULL);
}

void string_dict_write_bool(StringDict* this, char* key, bool val) {
  // string_dict_write_data(this, key, 1, *(val ? 1 : 0));
}

void string_dict_write_int(StringDict* this, char* key, int val) {
  string_dict_write_data(this, key, sizeof(int), &val);
}

void string_dict_write_string(StringDict* this, char* key, char* data) {
  string_dict_write_data(this, key, strlen(data), data);
}

void* string_dict_get(StringDict *this, char* key) {
  LinkedRoot* root = (LinkedRoot*) this;

  int16_t list_key = linked_list_find_compare(root, key, prv_string_dict_contains_key);
  if (list_key == 0) {
    // Not Found
    return NULL;
  }

  StringDictTuple* tuple = linked_list_get(root, list_key);
  return tuple->data;
}
