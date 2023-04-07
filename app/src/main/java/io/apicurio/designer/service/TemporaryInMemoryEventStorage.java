/*
 * Copyright 2023 Red Hat Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.designer.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;

import io.apicurio.designer.rest.v0.beans.DesignEvent;

/**
 * FIXME Remove me when event storage is implemented in the SQL layer!
 */
@ApplicationScoped
public class TemporaryInMemoryEventStorage {
    
    private Map<String, List<DesignEvent>> allEvents = new HashMap<>();

    /**
     * @param designId
     */
    public DesignEvent getFirst(String designId) {
        List<DesignEvent> events = allEvents.get(designId);
        if (events == null || events.size() == 0) {
            return null;
        }
        return events.get(0);
    }

    /**
     * @param designId
     */
    public List<DesignEvent> getAll(String designId) {
        List<DesignEvent> events = allEvents.get(designId);
        if (events == null) {
            return Collections.emptyList();
        }
        List<DesignEvent> rval = new ArrayList<>(events);
        Collections.reverse(rval);
        return rval;
    }

    /**
     * @param designId
     * @param newEvent
     */
    public void add(String designId, DesignEvent newEvent) {
        List<DesignEvent> events = allEvents.get(designId);
        if (events == null) {
            events = new LinkedList<>();
            allEvents.put(designId, events);
        }
        events.add(newEvent);
    }

}
